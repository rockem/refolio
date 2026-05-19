# Local + CI orchestration for the E2E test stack.
# Pulls Supabase connection info from `supabase status` at runtime — the same
# logic runs on a developer's machine and on GitHub Actions.

SHELL := /usr/bin/env bash

E2E_USER_EMAIL ?= test@refolio.local
E2E_USER_PASSWORD ?= test-password-123

.PHONY: supabase supabase-stop seed test

supabase:
	supabase start

supabase-stop:
	supabase stop

seed: supabase
	@eval "$$(supabase status --output env)" && \
		NEXT_PUBLIC_SUPABASE_URL="$$API_URL" \
		SUPABASE_SECRET_KEY="$$SECRET_KEY" \
		E2E_USER_EMAIL="$(E2E_USER_EMAIL)" \
		E2E_USER_PASSWORD="$(E2E_USER_PASSWORD)" \
		./scripts/seed-test-user.sh

test: seed
	@eval "$$(supabase status --output env)" && \
		NEXT_PUBLIC_SUPABASE_URL="$$API_URL" \
		NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="$$PUBLISHABLE_KEY" \
		E2E_USER_EMAIL="$(E2E_USER_EMAIL)" \
		E2E_USER_PASSWORD="$(E2E_USER_PASSWORD)" \
		npm run test:e2e
