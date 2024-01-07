module.exports = {
	forceExit: true,
	collectCoverage: true,
	testEnvironment: "node",
	maxWorkers: 1,
	transform: {
		"^.+\\.(ts|tsx)$": [
			"ts-jest", {
				isolatedModules: true,
			},
		],
	},
	testMatch: [
		"**/__tests__/**/*.test.ts",
	],
	collectCoverageFrom: [
		"./lib/**/*.ts",
		"!./**/*.d.ts",
	],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			functions: 100,
			lines: 100,
		},
	},
};
