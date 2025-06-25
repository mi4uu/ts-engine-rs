import * as rsq from "rsquared-js";
export function add(a: number, b: number): number {
    return a + b;
}

if (import.meta.main) {
    await genkey();

    await genkey();
}

async function genkey() {
    let { PrivateKey, key } = rsq;
    let seed = "THIS IS A TERRIBLE BRAINKEY SEED WORD SEQUENCE";
    let pkey = PrivateKey.fromSeed(key.normalize_brainKey(seed));
    await waitForTwoSeconds();

    console.log("\nPrivate key:", pkey.toWif());
    console.log("Public key :", pkey.toPublicKey().toString(), "\n");
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀");

}

function waitForTwoSeconds(): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 2000); // 2 seconds = 2000 milliseconds
    });
}
