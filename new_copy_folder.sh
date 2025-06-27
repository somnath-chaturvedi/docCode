#!/bin/bash

# --- CONFIGURATION ---
ID_FILE="ids.txt"                    # File containing list of IDs (one per line)
SOURCE_DIR="/Users/somnathchaturvedi/Documents/source"        # Directory containing folders to check
DEST_DIR="/Users/somnathchaturvedi/Documents/destination"     # Directory to copy matched folders to
NOT_FOUND_FILE="not_found_ids.txt"          # Output file for unmatched IDs

# Clear or create the not found file
> "$NOT_FOUND_FILE"

# Create destination directory if it doesn't exist
mkdir -p "$DEST_DIR"

# Read each ID from the file
while IFS= read -r id || [[ -n "$id" ]]; do
    echo "Processing ID: $id"
    found=0
    
    for folder in "$SOURCE_DIR"/*; do
        if [[ -d "$folder" && "$(basename "$folder")" == *"$id"* ]]; then
            echo "Copying folder: $(basename "$folder")"
            cp -r "$folder" "$DEST_DIR/"
            found=1
        fi
    done

    # If no folder matched, log the ID
    if [[ $found -eq 0 ]]; then
        echo "$id" >> "$NOT_FOUND_FILE"
    fi

done < "$ID_FILE"

echo "Processing complete."
echo "Unmatched IDs saved to: $NOT_FOUND_FILE"
