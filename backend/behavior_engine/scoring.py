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


def _localized(locale: str, en: str, hi: str) -> str:
    return hi if locale == "hi" else en


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


def _explanation(locale: str, name: str, direction: DirectionBand, confidence: ConfidenceBand) -> tuple[str, str | None]:
    if confidence == ConfidenceBand.LIMITED:
        return (
            _localized(locale, f"There is not enough evidence yet to describe your {name} pattern.", f"आपके {name} पैटर्न का वर्णन करने के लिए अभी पर्याप्त संकेत नहीं हैं।"),
            _localized(locale, "More relevant situations would make this reflection clearer.", "और प्रासंगिक स्थितियाँ इस चिंतन को अधिक स्पष्ट बनाएँगी।"),
        )
    if confidence == ConfidenceBand.MIXED:
        return (
            _localized(locale, f"Your {name} pattern appears mixed across these situations.", f"इन स्थितियों में आपका {name} पैटर्न मिश्रित दिखता है।"),
            _localized(locale, "Context may matter more than a single default style.", "एक ही स्थायी शैली से अधिक संदर्भ महत्वपूर्ण हो सकता है।"),
        )
    if locale == "hi":
        if confidence == ConfidenceBand.CLEAR:
            return (f"इन स्थितियों में {name} अधिक स्पष्ट दिखता है।" if direction == DirectionBand.HIGHER else f"इन स्थितियों में {name} अपेक्षाकृत कम दिखता है।", None)
        return (f"आपके उत्तरों में {name} अधिक स्पष्ट होने के संकेत मिलते हैं।" if direction == DirectionBand.HIGHER else f"आपके उत्तरों में {name} अपेक्षाकृत कम होने के संकेत मिलते हैं।", None)
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
        explanation, caveat = _explanation(locale, getattr(dimension.name, locale), direction, confidence)
        results.append(DimensionResult(
            dimension_id=dimension.id,
            direction=direction,
            confidence=confidence,
            evidence=evidence,
            explanation=explanation,
            caveat=caveat,
        ))
    return results
