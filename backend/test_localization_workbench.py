import pytest

from localization_workbench import LocalizationBlockEdit, LocalizationBlockSave, LocalizationReviewInput, apply_human_edit, apply_review_action, initialize_block
from localization_provider import LocalizationDraftRequest, LocalizationDraftResult, LocalizationProviderRegistry


def payload():
    return LocalizationBlockSave(locale="es", content_id="HOME.HERO.TITLE", page_family="home", source_revision="en-r1", english_source="Meet the person you already are.", ai_draft="Conoce mejor a la persona que eres.")


def test_workbench_block_records_versions_without_a_publication_action():
    block = initialize_block(payload(), "reviewer@example.com")
    assert block["approval_status"] == "draft" and block["published_copy"] is None
    edited = apply_human_edit(block, LocalizationBlockEdit(human_edit="Descubre la persona que ya eres.", comment="More natural opening"), "reviewer@example.com")
    approved = apply_review_action(edited, LocalizationReviewInput(action="approve", comment="Editorial review complete"), "reviewer@example.com")
    locked = apply_review_action(approved, LocalizationReviewInput(action="lock", comment="Lock approved wording"), "reviewer@example.com")
    assert locked["locked"] is True and locked["published_copy"] is None


def test_workbench_rejects_edits_to_locked_or_unedited_approval():
    block = initialize_block(payload(), "reviewer@example.com")
    with pytest.raises(ValueError, match="Human-edited wording"):
        apply_review_action(block, LocalizationReviewInput(action="approve", comment="Cannot approve AI-only text"), "reviewer@example.com")
    edited = apply_human_edit(block, LocalizationBlockEdit(human_edit="Texto revisado.", comment="Edited"), "reviewer@example.com")
    locked = apply_review_action(apply_review_action(edited, LocalizationReviewInput(action="approve", comment="Approved"), "reviewer@example.com"), LocalizationReviewInput(action="lock", comment="Locked"), "reviewer@example.com")
    with pytest.raises(ValueError, match="locked"):
        apply_human_edit(locked, LocalizationBlockEdit(human_edit="Cambio", comment="Should fail"), "reviewer@example.com")


def test_workbench_restore_requires_a_human_edit_history_version():
    block = initialize_block(payload(), "reviewer@example.com")
    edited = apply_human_edit(block, LocalizationBlockEdit(human_edit="Versión humana.", comment="First pass"), "reviewer@example.com")
    restored = apply_review_action(edited, LocalizationReviewInput(action="restore", comment="Restore", restore_version=1), "reviewer@example.com")
    assert restored["human_edit"] == "Versión humana." and restored["approval_status"] == "draft"
    with pytest.raises(ValueError, match="unavailable"):
        apply_review_action(edited, LocalizationReviewInput(action="restore", comment="Invalid", restore_version=99), "reviewer@example.com")


def test_provider_registry_is_pluggable_and_does_not_require_a_default_provider():
    registry = LocalizationProviderRegistry()
    with pytest.raises(LookupError): registry.get("missing")
    class FakeProvider:
        name = "reviewed-provider"
        def generate(self, request): return LocalizationDraftResult(provider=self.name, provider_model="fake-v1", prompt_version=request.prompt_version, output={"text": "Draft"}, confidence=0.95)
    registry.register(FakeProvider())
    request = LocalizationDraftRequest(locale="es", content_id="HOME.HERO.TITLE", stage="native_editorial_writer", prompt_version="kgli-v1", prompt="Structured KGLI brief")
    assert registry.get("reviewed-provider").generate(request).confidence == 0.95
