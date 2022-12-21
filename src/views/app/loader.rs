use std::fs;

pub fn read_file(path: String) -> String {
    let data: String = fs::read_to_string(path).expect("Unable to read file");

    return data;
}
