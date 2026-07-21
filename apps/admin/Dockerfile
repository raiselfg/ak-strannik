FROM node:22-alpine AS base

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable \
    && corepack prepare pnpm@11.9.0 --activate


FROM base AS pruner

WORKDIR /app

COPY . .

RUN pnpm dlx turbo@2.9.18 prune @ak-strannik/admin --docker


FROM base AS builder

WORKDIR /app

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/full/packages/database/prisma ./packages/database/prisma

RUN pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ ./

ENV NEXT_TELEMETRY_DISABLED=1

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy \
    BETTER_AUTH_SECRET=build-only-build-only-build-only \
    BETTER_AUTH_URL=http://localhost:3000 \
    AWS_ENDPOINT=http://localhost:9000 \
    AWS_REGION=eu-central-1 \
    AWS_ACCESS_KEY=build-only \
    AWS_SECRET_KEY=build-only \
    AWS_BUCKET=build-only \
    pnpm turbo run build --filter=@ak-strannik/admin --env-mode=loose


FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/admin/.next/standalone ./

COPY --from=builder --chown=nextjs:nodejs \
    /app/node_modules/.pnpm/@img+sharp-libvips-linuxmusl-x64@1.3.2/node_modules/@img/sharp-libvips-linuxmusl-x64/lib/libvips-cpp.so.8.18.3 \
    /app/node_modules/.pnpm/@img+sharp-libvips-linuxmusl-x64@1.3.2/node_modules/@img/sharp-libvips-linuxmusl-x64/lib/libvips-cpp.so.8.18.3

COPY --from=builder --chown=nextjs:nodejs \
    /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/admin/server.js"]
