import tensorflow as tf

# Check if GPU is available
if tf.config.list_physical_devices('GPU'):
    print("GPU is available and TensorFlow is using it!")
else:
    print("GPU not available. Using CPU instead.")
