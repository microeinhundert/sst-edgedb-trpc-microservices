module.exports = {
  env: {
    node: true,
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "turbo",
    "prettier",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json"],
      },
      node: true,
    },
    "react": {
      version: "18",
    },
  },
  plugins: ["@typescript-eslint", "simple-import-sort"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-unresolved": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/prop-types": "off",
    "react/display-name": "off",
    "react/jsx-sort-props": [
      "error",
      {
        callbacksLast: true,
        shorthandLast: true,
        reservedFirst: true,
      },
    ],
  },
};
