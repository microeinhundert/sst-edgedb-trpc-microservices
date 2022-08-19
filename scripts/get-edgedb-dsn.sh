#!/bin/sh

SECRET_ARN=$(
    aws secretsmanager list-secrets \
        --filter Key="name",Values="EdgeDBConnection" \
        | jq --raw-output .SecretList \
        | jq -r ".[0].ARN"
)

aws secretsmanager get-secret-value \
    --secret-id $SECRET_ARN \
    | jq --raw-output .SecretString \
    | jq -r .dsn