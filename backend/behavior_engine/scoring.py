from __future__ import annotations

from collections import defaultdict
from typing import Dict, Iterable, List

from .models import (
    AnalyzerDefinition,
    ConfidenceBand,
    DimensionEvidence,
    DimensionResult,
    DirectionBand,
)


def _localized(locale: str, analyzer_slug: str, en: str, hi: str, fr: str, ja: str) -> str:
    if locale == "hi": return hi
    if locale == "fr" and analyzer_slug == "communication-style": return fr
    if locale == "ja" and analyzer_slug == "communication-style": return ja
    return en


def _confidence(evidence: DimensionEvidence) -> ConfidenceBand:
    if evidence.signal_count < 2 or evidence.strong_signal_count < 1:
        return ConfidenceBand.LIMITED
    total = evidence.positive_weight + evidence.negative_weight
    dominance = max(evidence.positive_weight, evidence.negative_weight) / total if total else 0
    if dominance < 0.60:
        return ConfidenceBand.MIXED
    if evidence.signal_count >= 3 and len(evidence.contexts) >= 2 and dominance >= 0.70:
        return ConfidenceBand.CLEAR
    return ConfidenceBand.EMERGING


def _direction(evidence: DimensionEvidence, confidence: ConfidenceBand) -> DirectionBand:
    if confidence == ConfidenceBand.LIMITED:
        return DirectionBand.LIMITED
    if confidence == ConfidenceBand.MIXED:
        return DirectionBand.BALANCED
    return DirectionBand.HIGHER if evidence.raw_score > 0 else DirectionBand.LOWER


def _explanation(locale: str, analyzer_slug: str, name: str, direction: DirectionBand, confidence: ConfidenceBand) -> tuple[str, str | None]:
    if confidence == ConfidenceBand.LIMITED:
        return (
            _localized(locale, analyzer_slug, f"There is not enough evidence yet to describe your {name} pattern.", f"आपके {name} पैटर्न का वर्णन करने के लिए अभी पर्याप्त संकेत नहीं हैं।", f"Les éléments sont encore insuffisants pour décrire votre tendance en matière de {name}.", f"まだ、{name}の傾向を説明できるだけの材料がありません。"),
            _localized(locale, analyzer_slug, "More relevant situations would make this reflection clearer.", "और प्रासंगिक स्थितियाँ इस चिंतन को अधिक स्पष्ट बनाएँगी।", "Des situations plus pertinentes rendraient cette réflexion plus claire.", "関連する場面が増えると、より明確に振り返れます。"),
        )
    if confidence == ConfidenceBand.MIXED:
        return (
            _localized(locale, analyzer_slug, f"Your {name} pattern appears mixed across these situations.", f"इन स्थितियों में आपका {name} पैटर्न मिश्रित दिखता है।", f"Votre tendance en matière de {name} paraît contrastée selon ces situations.", f"これらの場面では、{name}の傾向にばらつきがあります。"),
            _localized(locale, analyzer_slug, "Context may matter more than a single default style.", "एक ही स्थायी शैली से अधिक संदर्भ महत्वपूर्ण हो सकता है।", "Le contexte peut compter davantage qu’un style unique et constant.", "一つの決まったスタイルよりも、状況の影響が大きいのかもしれません。"),
        )
    if locale == "hi":
        if confidence == ConfidenceBand.CLEAR:
            return (f"इन स्थितियों में {name} अधिक स्पष्ट दिखता है।" if direction == DirectionBand.HIGHER else f"इन स्थितियों में {name} अपेक्षाकृत कम दिखता है।", None)
        return (f"आपके उत्तरों में {name} अधिक स्पष्ट होने के संकेत मिलते हैं।" if direction == DirectionBand.HIGHER else f"आपके उत्तरों में {name} अपेक्षाकृत कम होने के संकेत मिलते हैं।", None)
    if locale == "fr" and analyzer_slug == "communication-style":
        tendency = "plus marquée" if direction == DirectionBand.HIGHER else "moins marquée"
        opening = "Dans ces situations, votre tendance en matière de" if confidence == ConfidenceBand.CLEAR else "Vos réponses suggèrent que votre tendance en matière de"
        return (f"{opening} {name} est {tendency}.", None)
    if locale == "ja" and analyzer_slug == "communication-style":
        tendency = "強く表れています" if direction == DirectionBand.HIGHER else "あまり表れていません"
        if confidence == ConfidenceBand.CLEAR:
            return (f"これらの場面では、{name}が{tendency}。", None)
        emerging = "強く表れる" if direction == DirectionBand.HIGHER else "あまり表れない"
        return (f"回答からは、{name}が{emerging}傾向がうかがえます。", None)
    tendency = "more present" if direction == DirectionBand.HIGHER else "less present"
    opening = "Across these situations," if confidence == ConfidenceBand.CLEAR else "Your responses suggest that"
    return (f"{opening} {name} is {tendency}.", None)


def calculate_dimension_results(
    definition: AnalyzerDefinition,
    responses: Dict[str, str],
    locale: str,
    skipped_scenarios: int = 0,
) -> List[DimensionResult]:
    """Apply authored signed weights. It intentionally produces no global score."""
    by_scenario = {scenario.id: scenario for scenario in definition.scenarios}
    aggregates: Dict[str, dict] = defaultdict(lambda: {"raw": 0.0, "positive": 0.0, "negative": 0.0, "signals": 0, "strong": 0, "contexts": set()})
    for scenario_id, option_id in responses.items():
        scenario = by_scenario[scenario_id]
        option = next(option for option in scenario.options if option.id == option_id)
        for dimension_id, value in option.scores.items():
            contribution = value * scenario.evidence_strength
            aggregate = aggregates[dimension_id]
            aggregate["raw"] += contribution
            aggregate["signals"] += 1
            aggregate["contexts"].add(scenario.category)
            if abs(contribution) >= 2:
                aggregate["strong"] += 1
            if contribution > 0:
                aggregate["positive"] += contribution
            else:
                aggregate["negative"] += abs(contribution)

    results: List[DimensionResult] = []
    for dimension in definition.dimensions:
        aggregate = aggregates[dimension.id]
        evidence = DimensionEvidence(
            dimension_id=dimension.id,
            raw_score=aggregate["raw"],
            positive_weight=aggregate["positive"],
            negative_weight=aggregate["negative"],
            signal_count=aggregate["signals"],
            strong_signal_count=aggregate["strong"],
            contexts=aggregate["contexts"],
            skipped_scenarios=skipped_scenarios,
        )
        confidence = _confidence(evidence)
        direction = _direction(evidence, confidence)
        explanation, caveat = _explanation(locale, definition.analyzer.slug, getattr(dimension.name, locale), direction, confidence)
        results.append(DimensionResult(
            dimension_id=dimension.id,
            direction=direction,
            confidence=confidence,
            evidence=evidence,
            explanation=explanation,
            caveat=caveat,
        ))
    return results
