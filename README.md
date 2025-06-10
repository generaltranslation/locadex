# Locadex Action

GitHub Action for running Locadex i18n automation on your project.

## Usage

```yaml
name: Locadex i18n
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: generaltranslation/locadex-action@v1
        with:
          api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          batch_size: '10'
          max_concurrent: '3'
          verbose: true
          debug: false
          match_files: 'src/**/*.tsx,src/**/*.ts'
          extensions: 'tsx,ts'
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `api_key` | Locadex API key | ✅ | - |
| `batch_size` | File batch size | ❌ | `10` |
| `max_concurrent` | Max number of concurrent agents | ❌ | `1` |
| `verbose` | Enable verbose output | ❌ | `false` |
| `debug` | Enable debug output | ❌ | `false` |
| `match_files` | Comma-separated list of glob patterns to match source files | ❌ | - |
| `extensions` | Comma-separated list of file extensions to match | ❌ | - |

## Development

```bash
# Install dependencies
npm install

# Build the action
npm run build

# Package for distribution
npm run package
```

## License

FSL-1.1-ALv2