#!/bin/sh

APP_NAME="sst_app"

# Install the EdgeDB CLI if not already installed
if ! [[ "$(which edgedb)" ]]; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
fi

SECRET_ARN=$(
    aws secretsmanager list-secrets \
        --filter Key="name",Values="EdgeDBConnection" \
        | jq --raw-output ".SecretList" \
        | jq -r ".[0].ARN"
)

DSN=$(
    aws secretsmanager get-secret-value \
        --secret-id $SECRET_ARN \
        | jq --raw-output ".SecretString" \
        | jq -r ".dsn"
)

edgedb instance link \
    --non-interactive \
    --trust-tls-cert \
    --overwrite \
    --dsn $DSN \
    $APP_NAME