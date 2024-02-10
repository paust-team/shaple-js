import {defineConfig} from "vitest/config";
import pkg from './package.json';

export default defineConfig({
    define: {
        PACKAGE_NAME: JSON.stringify(pkg.name),
        PACKAGE_VERSION: JSON.stringify(pkg.version)
    }
})