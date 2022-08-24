module default {
    type User {
        required property email -> str {
            constraint exclusive;
        }
        required property given_name -> str;
        required property family_name -> str;
    }
}