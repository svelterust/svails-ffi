#[no_mangle]
pub extern "C" fn sum(numbers: *const f32, length: usize) -> f32 {
    let input = unsafe { std::slice::from_raw_parts(numbers, length) };
    input.iter().sum()
}
