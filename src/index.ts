/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-shadow */
function detectProvider<T extends Object>(
  {
    silent,
    timeout,
    walletFlag,
    isSingleWalletFlag,
    injectFlag,
    defaultWalletFlag,
  }: {
    silent?: boolean;
    timeout?: number;
    walletFlag?: string;
    isSingleWalletFlag?: boolean;
    injectFlag: string;
    defaultWalletFlag?: string;
  } = {
    silent: false,
    timeout: 1500,
    injectFlag: 'ethereum',
  },
): Promise<T> {
  let handled = false;

  return new Promise((resolve, reject) => {
    if ((globalThis as any)[injectFlag]) {
      handleEthereum();
    } else {
      globalThis.addEventListener(`${injectFlag}#initialized`, handleEthereum, {
        once: true,
      });

      if (Number(timeout) > 0) {
        setTimeout(() => {
          handleEthereum();
        }, timeout);
      } else {
        handleEthereum();
      }
    }

    function handleEthereum() {
      if (handled) {
        return;
      }
      handled = true;

      globalThis.removeEventListener(
        `${injectFlag}#initialized`,
        handleEthereum,
      );

      let provider = (globalThis as any)[injectFlag] as T;
      if (!provider) {
        return reject(`Unable to detect window.${injectFlag}.`);
      }

      let mustBeSpecifiedWallet = false;
      let isSpecifiedWallet = false;

      // edge case if e.g. metamask and coinbase wallet are both installed
      const { providers } = provider as any;
      if (providers?.length) {
        if (typeof walletFlag !== 'string' || !walletFlag) {
          if (defaultWalletFlag) {
            provider = providers.find((provider: any) => judgeIsSpecifiedWallet(
              provider,
              defaultWalletFlag,
              isSingleWalletFlag,
            ));
          } else {
            provider = providers[0];
          }
        } else {
          provider = providers.find((provider: any) => judgeIsSpecifiedWallet(provider, walletFlag!, isSingleWalletFlag));
        }
      } else {
        mustBeSpecifiedWallet = typeof walletFlag === 'string' && Boolean(walletFlag);
        isSpecifiedWallet =
          mustBeSpecifiedWallet &&
          judgeIsSpecifiedWallet(provider, walletFlag!, isSingleWalletFlag);
      }

      if ((provider && !mustBeSpecifiedWallet) || isSpecifiedWallet) {
        resolve(provider);
      } else {
        const message = `Non-${walletFlag} Wallet detected.`;
        !silent && console.error('detect-provider:', message);
        reject(message);
      }
    }
  });
}

function judgeIsSpecifiedWallet(
  provider: any,
  walletFlag: string,
  isSingleWalletFlag = false,
) {
  const walletFlagKeys = provider
    ? Object.keys(provider).filter((key) => key?.startsWith('is'))
    : [];
  return (
    Boolean(provider) &&
    (isSingleWalletFlag
      ? walletFlagKeys.length === 1 && walletFlagKeys[0] === walletFlag
      : walletFlagKeys.includes(walletFlag))
  );
}

export = detectProvider;
