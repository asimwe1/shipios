pub const SCHEMA_VERSION: &str = "0.1.0";

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ShipiosApp {
    pub schema_version: &'static str,
    pub app: AppMetadata,
    pub screens: Vec<Screen>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct AppMetadata {
    pub name: String,
    pub bundle_id: String,
    pub platform: Platform,
    pub theme: Theme,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Platform {
    SwiftUi,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Theme {
    pub primary_color: String,
    pub accent_color: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Screen {
    pub id: String,
    pub title: String,
    pub components: Vec<Component>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Component {
    pub id: String,
    pub kind: ComponentKind,
    pub label: Option<String>,
    pub children: Vec<Component>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ComponentKind {
    Text,
    Button,
    List,
    Card,
    Toggle,
    TextField,
}

impl ShipiosApp {
    pub fn empty(app: AppMetadata) -> Self {
        Self { schema_version: SCHEMA_VERSION, app, screens: Vec::new() }
    }
}

#[cfg(test)]
mod tests {
    use super::{AppMetadata, Platform, SCHEMA_VERSION, ShipiosApp, Theme};

    #[test]
    fn empty_apps_use_the_current_schema_version() {
        let app = AppMetadata {
            name: "ShipiOS Demo".to_string(),
            bundle_id: "dev.shipios.demo".to_string(),
            platform: Platform::SwiftUi,
            theme: Theme {
                primary_color: "#111827".to_string(),
                accent_color: "#14B8A6".to_string(),
            },
        };

        let project = ShipiosApp::empty(app);

        assert_eq!(project.schema_version, SCHEMA_VERSION);
        assert!(project.screens.is_empty());
    }
}
