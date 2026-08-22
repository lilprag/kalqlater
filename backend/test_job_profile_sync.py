from job_marketplace import career_identity, career_shared_update, profile_completeness


def community_profile():
    return {"display_name":"Asha Rao","profession":"Product Designer","years_experience":6,"skills":["Figma","Research"],"city":"Bengaluru","country":"India","industries":["SaaS"],"languages":["English","Hindi"],"social_links":{"linkedin":"https://linkedin.com/in/asha","portfolio":"https://asha.example"}}


def test_existing_community_identity_prefills_career_fields():
    assert career_identity(community_profile()) == {"full_name":"Asha Rao","current_job_title":"Product Designer","years_experience":6,"skills":["Figma","Research"],"current_location":"Bengaluru, India","city":"Bengaluru","country":"India","industries":["SaaS"],"languages":["English","Hindi"],"linkedin_url":"https://linkedin.com/in/asha","portfolio_url":"https://asha.example"}


def test_shared_career_edits_map_back_to_community_identity():
    update=career_shared_update({"full_name":"Asha R.","current_job_title":"Design Lead","years_experience":7,"skills":["Figma"],"industries":["SaaS"],"languages":["English"],"city":"Mumbai","country":"India","linkedin_url":"https://linkedin.com/in/asha-r","portfolio_url":""})
    assert update["display_name"] == "Asha R."
    assert update["profession"] == "Design Lead"
    assert update["_links"]["linkedin"] == "https://linkedin.com/in/asha-r"


def test_completeness_counts_shared_fields_once():
    merged={**career_identity(community_profile()),"target_roles":["Design Lead"],"notice_period":"30_days","remote_preference":"hybrid"}
    assert profile_completeness(merged) == {"percent":100,"missing":[]}
