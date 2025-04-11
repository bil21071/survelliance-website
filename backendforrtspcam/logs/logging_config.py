import logging

# Configure the logger
stream_logger = logging.getLogger("stream_logger")
stream_logger.setLevel(logging.INFO)

# Create a file handler
file_handler = logging.FileHandler("application.log")
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Create a stream handler for console output
stream_handler = logging.StreamHandler()
stream_handler.setFormatter(formatter)

# Add the file handler to the logger
stream_logger.addHandler(file_handler)
stream_logger.addHandler(stream_handler)
