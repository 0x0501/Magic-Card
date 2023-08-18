// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#[tauri::command]
fn get_raw_key() -> String {
    String::from("66C0535-42C5-4772-B8CA-E33CF29582BF")
}
#[tauri::command]
fn get_raw_iv() -> String {
    String::from("51CCEFAF-7A36-4C96-84BE-6A8BC3B5B91E")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_raw_key, get_raw_iv])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
