#!/bin/bash

# --- CONFIGURATION ---
ID_FILE="ids.txt"                    # File containing list of IDs (one per line)
SOURCE_DIR="/Users/somnathchaturvedi/Documents/source"        # Directory containing folders to check
DEST_DIR="/Users/somnathchaturvedi/Documents/destination"     # Directory to copy matched folders to

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Read each ID from the file
while IFS= read -r id || [[ -n "$id" ]]; do
    echo "Processing ID: $id"
    
    # Loop over folders in the source directory
    for folder in "$SOURCE_DIR"/*; do
        if [[ -d "$folder" && "$(basename "$folder")" == *"$id"* ]]; then
            echo "Copying folder: $(basename "$folder")"
            cp -r "$folder" "$DEST_DIR/"
        fi
    done
done < "$ID_FILE"

echo "All matching folders copied successfully."
