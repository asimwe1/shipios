use shipios_schema::{SCHEMA_VERSION, ShipiosApp};

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ValidationIssue {
    pub code: &'static str,
    pub message: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ValidationReport {
    pub is_valid: bool,
    pub issues: Vec<ValidationIssue>,
}

pub fn validate_app(app: &ShipiosApp) -> ValidationReport {
    let mut issues = Vec::new();

    if app.schema_version != SCHEMA_VERSION {
        issues.push(ValidationIssue {
            code: "schema.version_mismatch",
            message: format!(
                "Expected schema version {SCHEMA_VERSION}, got {}",
                app.schema_version
            ),
        });
    }

    if app.app.name.trim().is_empty() {
        issues.push(ValidationIssue {
            code: "app.name_missing",
            message: "App name must not be empty".to_string(),
        });
    }

    if app.screens.is_empty() {
        issues.push(ValidationIssue {
            code: "screen.none_defined",
            message: "At least one screen is required".to_string(),
        });
    }

    ValidationReport { is_valid: issues.is_empty(), issues }
}

#[cfg(test)]
mod tests {
    use shipios_schema::{AppMetadata, Platform, Theme};

    use super::validate_app;

    #[test]
    fn validate_app_flags_missing_screens() {
        let app = shipios_schema::ShipiosApp::empty(AppMetadata {
            name: "HabitFlow".to_string(),
            bundle_id: "dev.shipios.habitflow".to_string(),
            platform: Platform::SwiftUi,
            theme: Theme {
                primary_color: "#0F172A".to_string(),
                accent_color: "#14B8A6".to_string(),
            },
        });

        let report = validate_app(&app);

        assert!(!report.is_valid);
        assert_eq!(report.issues.len(), 1);
        assert_eq!(report.issues[0].code, "screen.none_defined");
    }
}
