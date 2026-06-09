import pkg from '../../package.json'
import registry from '../../registry.json'

/** Live package version for hero and sidebar. */
export const PACKAGE_VERSION = pkg.version

/** Registry component keys — one entry per shipped component (repo drift manifest). */
export const REGISTRY_COMPONENT_COUNT = Object.keys(registry.components).length

/** Foundation topic count (matches cmd-registry foundations sections). */
export const FOUNDATION_TOPIC_COUNT = 12

/** Design-system color tokens surfaced on Foundations. */
export const COLOR_TOKEN_COUNT = 55
