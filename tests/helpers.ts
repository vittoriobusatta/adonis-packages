import type { PackageInfo } from '#types/main'

import { load } from 'js-yaml'
import { join } from 'node:path'
import { faker } from '@faker-js/faker'
import { getDirname } from '@poppinss/utils'
import { readFile, rm } from 'node:fs/promises'
import { PackageFetcher } from '#services/package_fetcher'

import { categories } from '../content/categories.js'

const dirname = getDirname(import.meta.url)

export async function readPackageFile(name: string) {
  const yml = await readFile(join(dirname, `../content/packages/${name}.yml`), 'utf-8')
  return load(yml) as PackageInfo
}

export async function deletePackageFile(name: string) {
  const file = join(dirname, `../content/packages/${name}.yml`)
  await rm(file)
}

/**
 * Fake package fetcher to avoid making real requests.
 * Will return random numbers for stars and downloads
 */
export class FakePkgFetcher extends PackageFetcher {
  async fetchGithubStars(_repo: string) {
    return { stars: faker.number.int({ min: 200 }) }
  }

  async fetchPackageDownloads(_name: string) {
    return { downloads: faker.number.int({ min: 20_000 }) }
  }
}

/**
 * Generate a fake package
 */
export function packageFactory(overrides: Partial<PackageInfo> = {}): PackageInfo {
  return {
    name: faker.string.alphanumeric(10),
    category: faker.helpers.arrayElement(categories).label,
    compatibility: { adonis: '>=5.0.0' },
    description: faker.lorem.sentence(),
    downloads: 0,
    github: faker.string.alphanumeric(10),
    repo: faker.string.alphanumeric(10),
    stars: 0,
    npm: faker.string.alphanumeric(10),
    website: faker.internet.url(),
    type: '3rd-party',
    ...overrides,
  }
}
