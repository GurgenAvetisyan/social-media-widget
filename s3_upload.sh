#!/bin/bash


if ! command -v aws &>/dev/null; then
    echo "AWS CLI not found. Please install it before running this script."
    exit 1
fi

usage() {
    echo -e "\nUsage:"
    echo -e "  $0 --env <dev|qa|prod> --file <path-to-sdk.js>\n"
    echo "Description:"
    echo "  This script uploads the specified sdk.js file to the appropriate S3 folder"
    echo "  for the given environment (dev, qa, or prod). The file will overwrite the"
    echo "  existing sdk.js in the respective environment folder."
    echo
    echo "Example:"
    echo "  s3_upload.sh --env dev --file /path/to/sdk.js"
    echo
    exit 1
}

PROFILE="default" 
while [[ $# -gt 0 ]]; do
    case "$1" in
    --env)
        ENV="$2"
        shift
        shift
        ;;
    --file)
        FILE="$2"
        shift
        shift
        ;;
    --profile)
        PROFILE="$2"
        shift
        shift
        ;;
    *)
        usage
        ;;
    esac
done

if [[ -z "$ENV" || -z "$FILE" ]]; then
    usage
fi

if [[ "$ENV" != "dev" && "$ENV" != "qa" && "$ENV" != "prod" ]]; then
    echo "Error: Invalid environment specified. Use 'dev', 'qa', or 'prod'."
    usage
fi

if [[ ! -f "$FILE" ]]; then
    echo "Error: File '$FILE' not found."
    exit 1
fi

BUCKET_NAME="frontend-widgets"
S3_PATH="s3://${BUCKET_NAME}/${ENV}/widget/sdk.js"

echo "Uploading '$FILE' to '$S3_PATH'..."
aws s3 cp "$FILE" "$S3_PATH" --acl private --profile "$PROFILE"

if [[ $? -eq 0 ]]; then
    echo "File uploaded successfully to '$S3_PATH'."
else
    echo "Error: Failed to upload the file."
    exit 1
fi
