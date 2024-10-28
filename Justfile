dev:
	cd sum && cargo watch -x "build && cp target/debug/libsum.so ../"

release:
	cd sum && cargo build --release && cp target/release/libsum.so ../
