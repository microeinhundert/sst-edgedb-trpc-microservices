export function formatErrors(errors) {
    return Object.entries(errors)
        .map(([name, value]) => {
        if (value && "_errors" in value) {
            return `${name}: ${value._errors.join(", ")}\n`;
        }
        return false;
    })
        .filter(Boolean);
}
