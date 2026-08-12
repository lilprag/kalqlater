from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Dict, List, Literal, Optional, Set

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class LocalizedText(BaseModel):
    model_config = ConfigDict(extra="forbid")
    en: str = Field(min_length=1)
    hi: str = Field(min_length=1)


class AnalyzerStatus(str, Enum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    RETIRED = "retired"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"
    ABANDONED = "abandoned"


class ConfidenceBand(str, Enum):
    CLEAR = "clear-pattern"
    EMERGING = "emerging-pattern"
    MIXED = "mixed-evidence"
    LIMITED = "limited-evidence"


class DirectionBand(str, Enum):
    HIGHER = "higher"
    LOWER = "lower"
    BALANCED = "balanced"
    LIMITED = "limited"


class AnalyzerVersion(BaseModel):
    model_config = ConfigDict(extra="forbid")
    value: str = Field(min_length=1, max_length=80)
    status: AnalyzerStatus


class DimensionDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    name: LocalizedText


class ScoreContribution(BaseModel):
    model_config = ConfigDict(extra="forbid")
    dimension_id: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    value: int = Field(ge=-3, le=3)

    @field_validator("value")
    @classmethod
    def non_zero(cls, value: int) -> int:
        if value == 0:
            raise ValueError("score contribution must not be zero")
        return value


class ResponseOptionDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{1,80}$")
    text: LocalizedText
    scores: Dict[str, int] = Field(min_length=1)

    @field_validator("scores")
    @classmethod
    def validate_scores(cls, scores: Dict[str, int]) -> Dict[str, int]:
        for dimension_id, value in scores.items():
            ScoreContribution(dimension_id=dimension_id, value=value)
        return scores


class ScenarioDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{2,100}$")
    category: str = Field(min_length=1, max_length=80)
    difficulty: Literal["basic", "moderate", "advanced"]
    sensitivity: Literal["standard", "personal"]
    evidence_strength: float = Field(alias="evidenceStrength", ge=0.5, le=2.0)
    social_desirability_risk: Literal["low", "medium", "medium-high", "high"] = Field(alias="socialDesirabilityRisk")
    ambiguity_note: str = Field(alias="ambiguityNote", min_length=1, max_length=500)
    rationale: str = Field(min_length=1, max_length=500)
    prompt: LocalizedText
    options: List[ResponseOptionDefinition] = Field(min_length=4, max_length=4)

    @model_validator(mode="after")
    def unique_option_ids(self) -> "ScenarioDefinition":
        if len({option.id for option in self.options}) != len(self.options):
            raise ValueError("scenario contains duplicate option IDs")
        return self


class ConfidenceRule(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: ConfidenceBand
    requirements: str = Field(min_length=1)
    wording: LocalizedText


class CrossDimensionRule(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    when: Dict[str, DirectionBand] = Field(min_length=2)
    summary: LocalizedText


class InterpretationRule(BaseModel):
    model_config = ConfigDict(extra="forbid")
    hierarchy: List[str] = Field(min_length=1)
    cross_dimension_rules: List[CrossDimensionRule] = Field(alias="crossDimensionRules", min_length=1)


class ChallengeDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    dimension: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    title: LocalizedText
    instruction: LocalizedText


class Recommendation(BaseModel):
    """A stable, localized coaching item chosen server-side."""
    id: str = Field(pattern=r"^[a-z0-9-]{2,120}$")
    text: str = Field(min_length=1, max_length=500)


class OptionScoringPolicy(BaseModel):
    model_config = ConfigDict(extra="forbid")
    confidence_contribution: str = Field(alias="confidenceContribution", min_length=1)
    default_ambiguity: str = Field(alias="defaultAmbiguity", min_length=1)
    default_social_desirability_risk: str = Field(alias="defaultSocialDesirabilityRisk", min_length=1)
    balancing_signal: str = Field(alias="balancingSignal", min_length=1)


class ContentReview(BaseModel):
    model_config = ConfigDict(extra="forbid")
    required: List[str] = Field(min_length=1)
    publication_requirements: List[str] = Field(alias="publicationRequirements", min_length=1)


class AnalyzerMetadata(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    slug: str = Field(pattern=r"^[a-z0-9-]{2,80}$")
    version: str = Field(min_length=1, max_length=80)
    status: AnalyzerStatus
    type: str = Field(min_length=1)
    locales: List[Literal["en", "hi"]] = Field(min_length=1)
    no_overall_score: bool = Field(alias="noOverallScore")
    disclosures: LocalizedText


class AnalyzerDefinition(BaseModel):
    model_config = ConfigDict(extra="forbid")
    analyzer: AnalyzerMetadata
    dimensions: List[DimensionDefinition] = Field(min_length=8, max_length=10)
    scenarios: List[ScenarioDefinition] = Field(min_length=12, max_length=15)
    option_scoring_policy: OptionScoringPolicy = Field(alias="optionScoringPolicy")
    confidence_rules: List[ConfidenceRule] = Field(alias="confidenceRules", min_length=4)
    interpretation_rules: InterpretationRule = Field(alias="interpretationRules")
    weekly_challenges: List[ChallengeDefinition] = Field(alias="weeklyChallenges", min_length=15, max_length=25)
    review: ContentReview

    @model_validator(mode="after")
    def validate_references(self) -> "AnalyzerDefinition":
        dimension_ids = [dimension.id for dimension in self.dimensions]
        if len(set(dimension_ids)) != len(dimension_ids):
            raise ValueError("analyzer contains duplicate dimension IDs")
        scenario_ids = [scenario.id for scenario in self.scenarios]
        if len(set(scenario_ids)) != len(scenario_ids):
            raise ValueError("analyzer contains duplicate scenario IDs")
        if set(rule.id for rule in self.confidence_rules) != set(ConfidenceBand):
            raise ValueError("analyzer must define every confidence rule")
        known = set(dimension_ids)
        for scenario in self.scenarios:
            for option in scenario.options:
                unknown = set(option.scores) - known
                if unknown:
                    raise ValueError(f"option references unknown dimensions: {sorted(unknown)}")
        for challenge in self.weekly_challenges:
            if challenge.dimension not in known:
                raise ValueError("challenge references unknown dimension")
        for rule in self.interpretation_rules.cross_dimension_rules:
            if set(rule.when) - known:
                raise ValueError("interpretation rule references unknown dimension")
        return self


class PersonalityContext(BaseModel):
    model_config = ConfigDict(extra="forbid")
    type_code: str = Field(pattern=r"^(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)$")
    source: Literal["saved_test_result", "user_selected"]


class AssessmentResponseInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    scenario_id: str = Field(pattern=r"^[a-z0-9-]{2,100}$")
    option_id: str = Field(pattern=r"^[a-z0-9-]{1,80}$")
    idempotency_key: str = Field(min_length=8, max_length=128)


class StoredResponse(BaseModel):
    scenario_id: str
    option_id: str
    idempotency_key: str
    submitted_at: datetime


class AssessmentSessionState(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str
    access_token: str
    analyzer_slug: str
    analyzer_version: str
    locale: Literal["en", "hi"]
    scenario_ids: List[str]
    status: SessionStatus
    created_at: datetime
    expires_at: datetime
    responses: Dict[str, StoredResponse] = Field(default_factory=dict)
    personality_context: Optional[PersonalityContext] = None
    completed_at: Optional[datetime] = None
    result_id: Optional[str] = None


class DimensionEvidence(BaseModel):
    dimension_id: str
    raw_score: float
    positive_weight: float
    negative_weight: float
    signal_count: int
    strong_signal_count: int
    contexts: Set[str]
    skipped_scenarios: int


class DimensionResult(BaseModel):
    dimension_id: str
    direction: DirectionBand
    confidence: ConfidenceBand
    evidence: DimensionEvidence
    explanation: str
    caveat: Optional[str] = None


class SelectedInterpretation(BaseModel):
    rule_id: str
    text: str


class EvidenceMoment(BaseModel):
    id: str
    title: str
    observation: str


class AnalyzerResult(BaseModel):
    analyzer_slug: str
    analyzer_version: str
    locale: Literal["en", "hi"]
    summary: str
    dimension_results: List[DimensionResult]
    strengths: List[str]
    blind_spots: List[str]
    misunderstandings: List[str]
    practical_suggestions: List[Recommendation] = Field(min_length=3)
    weekly_challenge: Optional[ChallengeDefinition] = None
    interpretations: List[SelectedInterpretation]
    evidence_moments: List[EvidenceMoment] = Field(default_factory=list)
    personality_note: Optional[str] = None
    disclaimer: str

    @model_validator(mode="after")
    def no_overall_score(self) -> "AnalyzerResult":
        forbidden = {"overall_score", "score", "percentage"}
        if forbidden.intersection(self.model_fields_set):
            raise ValueError("analyzer results must not contain an overall score")
        return self


class ResultSnapshot(BaseModel):
    id: str
    session_id: str
    access_token: str
    created_at: datetime
    result: AnalyzerResult
