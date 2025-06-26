//@ts-ignore
import * as rsq from "rsquared-js";
export function add(a: number, b: number): number {
    return a + b;
}

//@ts-ignore
if (import.meta.main) {
    await genkey();

    await genkey();
}

async function genkey() {
    let { PrivateKey, key } = rsq;
    let seed = "THIS IS A TERRIBLE BRAINKEY SEED WORD SEQUENCE";
    let pkey = PrivateKey.fromSeed(key.normalize_brainKey(seed));

    console.log("will wait 2sec: ");
    console.log("1 ...")
    await waitForSecond();
   console.log("... 2 ...")
    await waitForSecond();
       console.log("... done")

    console.log("\nPrivate key:", pkey.toWif());
    console.log("Public key :", pkey.toPublicKey().toString(), "\n");
    
    console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀");

}

function waitForSecond(): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 1000); 
    });
}
