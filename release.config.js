module.exports = {
  branches: "master",
  repositoryUrl: "https://github.com/ftrip-io/frontend-service",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "docs/CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/github",
      {
        assets: ["docs/CHANGELOG.md"],
      },
    ],
  ],
};
