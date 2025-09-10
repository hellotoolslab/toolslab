// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Runtime};
use tauri_plugin_updater::UpdaterExt;

#[derive(Clone, serde::Serialize)]
struct UpdatePayload {
    message: String,
    version: String,
}

// Custom command to check for updates manually
#[tauri::command]
async fn check_for_updates<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    
    match updater.check().await {
        Ok(Some(update)) => {
            let version = update.version.clone();
            let body = update.body.clone().unwrap_or_default();
            
            // Emit update available event
            app.emit("update-available", UpdatePayload {
                message: body,
                version: version.clone(),
            }).ok();
            
            Ok(format!("Update available: {}", version))
        }
        Ok(None) => Ok("No updates available".to_string()),
        Err(e) => Err(e.to_string())
    }
}

// Command to trigger update download and installation
#[tauri::command]
async fn download_and_install_update<R: Runtime>(app: tauri::AppHandle<R>) -> Result<String, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    
    match updater.check().await {
        Ok(Some(update)) => {
            // Emit download started event
            app.emit("update-download-started", ()).ok();
            
            // Download and install
            update.download_and_install(|_event, _data| {
                // Progress callback - can emit progress events here
            }).await.map_err(|e| e.to_string())?;
            
            Ok("Update downloaded and installed successfully".to_string())
        }
        Ok(None) => Ok("No updates available".to_string()),
        Err(e) => Err(e.to_string())
    }
}

// Command to open external links in browser
#[tauri::command]
async fn open_external(url: String) -> Result<(), String> {
    open::that(url).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new()
            .target(tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::Stdout,
            ))
            .level(log::LevelFilter::Info)
            .build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Check for updates on startup (non-blocking)
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                // Wait a bit before checking for updates
                tokio::time::sleep(tokio::time::Duration::from_secs(5)).await;
                
                if let Ok(updater) = app_handle.updater() {
                    match updater.check().await {
                        Ok(Some(update)) => {
                            let version = update.version.clone();
                            let body = update.body.clone().unwrap_or_default();
                            
                            // Emit update available event
                            app_handle.emit("update-available", UpdatePayload {
                                message: body,
                                version,
                            }).ok();
                        }
                        _ => {}
                    }
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            check_for_updates,
            download_and_install_update,
            open_external
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// Required for lib.rs
pub fn run() {
    main();
}