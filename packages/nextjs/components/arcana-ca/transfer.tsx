import React, { useState, useEffect, useCallback } from 'react';
import { getCA } from "~~/utils/getCA";
import { Modal } from './Modal'; // Assuming you have a React Modal component
import type { CA, Intent, ProgressStep } from '@arcana/ca-sdk';
import type { AllowanceHookInput } from '@arcana/ca-sdk';
import { getTextFromStep } from "~~/utils/getTextFromSteps";
import { CHAINS } from '~~/utils/chains';
import { Toast, Toaster, createToaster } from '@ark-ui/react'; // Assuming you have a React Toast component or will create one
import { setAsyncInterval, clearAsyncInterval } from '~~/utils/async_interval';


interface Props {
    currentTab: 'transfer' | 'bridge' | 'refund';
  }
  
  const toaster = createToaster({ placement: 'top-end', overlap: false, gap: 24, duration: 5000 });
  const createErrorToast = (error: Error | string | unknown) => {
    console.log({ error });
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    }
    console.log({ errorToast: message });
    toaster.create({
      title: 'Error',
      description: message,
      type: 'error',
    });
  };
  
  const Transfer: React.FC<Props> = (props) => {
    console.log({ props: props.currentTab });
  
    const [messages, setMessages] = useState<{
      error: boolean;
      errorMsg: string;
      success: boolean;
      successMsg: string;
    }>({
      error: false,
      errorMsg: "",
      success: false,
      successMsg: ""
    });
  
    const [bridgeValue, setBridgeValue] = useState<{
      token: string,
      amount: string,
      chain: number,
      loading: boolean
    }>({
      token: "",
      amount: "",
      chain: 0,
      loading: false
    });
  
    const [transferValue, setTransferValue] = useState<{
      token: string;
      amount: string;
      chain: number;
      loading: boolean;
      to: string;
    }>({
      token: "",
      amount: "",
      chain: 0,
      loading: false,
      to: ""
    });
  
    const [ca, setCa] = useState<CA | null>(null);
  
    const [allowanceModal, setAllowanceModal] = useState<{
      data: AllowanceHookInput;
      allow: ((s: Array<"min" | "max" | bigint | string>) => void) | null;
      deny: (() => void) | null;
      open: boolean;
      allowances: Array<"min" | "max" | bigint | string>;
    }>({
      data: [],
      allow: null,
      deny: null,
      open: false,
      allowances: []
    });
  
    const [intentModal, setIntentModal] = useState<{
      open: boolean;
      allow: () => void;
      deny: () => void;
      refresh: (() => Promise<Intent>) | null;
      intent: Intent | null;
      sourcesOpen: boolean;
      feesBreakupOpen: boolean;
      intervalHandler: number | null;
      intentRefreshing: boolean;
    }>({
      allow: () => { },
      deny: () => { },
      refresh: null,
      intent: null,
      open: false,
      sourcesOpen: true,
      feesBreakupOpen: false,
      intervalHandler: null,
      intentRefreshing: false
    });
  
    const [refundValue, setRefundValue] = useState({
      hash: "",
      loading: false,
    });
  
    const [state, setState] = useState<{
      inProgress: boolean;
      completed: boolean;
      steps: Array<ProgressStep & { done: boolean }>;
    }>({
      inProgress: false,
      steps: [],
      completed: false
    });
  
    const eventListener = useCallback((data: any) => {
      switch (data.type) {
        case "EXPECTED_STEPS": {
          console.log("Expected steps", data.data);
          setState(prevState => ({
            ...prevState,
            steps: data.data.map((s: ProgressStep) => ({ ...s, done: false })),
            inProgress: true
          }));
          break;
        }
        case "STEP_DONE": {
          console.log("Step done", data.data);
          setState(prevState => {
            const updatedSteps = prevState.steps.map(s => {
              if (s.typeID === data.data.typeID) {
                return { ...s, done: true, data: data.data.data };
              }
              return s;
            });
            return { ...prevState, steps: updatedSteps };
          });
          break;
        }
      }
    }, []);
  
    useEffect(() => {
      let intervalHandler: number | null = null;
      let currentCa: CA | null = null;
  
      const initialize = async () => {
        currentCa = await getCA();
        setCa(currentCa);
        currentCa.addCAEventListener(eventListener);
  
        currentCa.setOnAllowanceHook(async ({ allow, deny, sources }) => {
          console.log({ allowancesInput: sources });
          setAllowanceModal({
            allow: allow,
            deny: deny,
            open: true,
            data: sources,
            allowances: []
          });
        });
  
        currentCa.setOnIntentHook(({ intent, allow, deny, refresh }) => {
          console.log({ intent });
          setIntentModal({
            allow: allow,
            deny: deny,
            refresh: refresh,
            intent: intent,
            open: true,
            sourcesOpen: true,
            feesBreakupOpen: false,
            intervalHandler: null,
            intentRefreshing: false
          });
  
          setTimeout(() => {
            intervalHandler = setAsyncInterval(async () => {
              if (refresh) {
                console.time("intentRefresh");
                setIntentModal(prevState => ({ ...prevState, intentRefreshing: true }));
                const refreshedIntent = await refresh();
                setIntentModal(prevState => ({ ...prevState, intent: refreshedIntent, intentRefreshing: false }));
                console.timeEnd("intentRefresh");
              }
            }, 5000) as unknown as number; // Type assertion as setAsyncInterval might return number or string depending on implementation
            setIntentModal(prevState => ({ ...prevState, intervalHandler: intervalHandler }));
          }, 5000);
        });
        await currentCa.init();
        console.log(await currentCa.getUnifiedBalances());
        console.log(await currentCa.allowance().tokens(["usdt", "usdc"]).get());
        console.log({ ca: currentCa });
      };
  
      initialize();
  
      return () => {
        if (currentCa) {
          currentCa.removeCAEventListener(eventListener);
        }
        if (intervalHandler) {
          clearAsyncInterval(intervalHandler);
        }
      };
    }, [eventListener]);
  
    const submitAllowance = () => {
      console.log("got submit");
      setAllowanceModal(prevState => ({ ...prevState, open: false }));
      if (allowanceModal.allow) {
        const values = allowanceModal.data.map(() => "1.15");
        allowanceModal.allow(values);
      }
    };
  
    const rejectAllowance = () => {
      console.log("got reject");
      setAllowanceModal(prevState => ({ ...prevState, open: false }));
      if (allowanceModal.deny) {
        allowanceModal.deny();
      }
    };
  
    const refundIntent = async () => {
      // refundValue.loading = true
      // try {
      //   // await ca?.refund(refundValue.hash as `0x${string}`)
      // } catch (e) {
      //   console.error("Refund failed with error", e);
      // } finally {
      //   refundValue.loading = false
      // }
    };
  
    const resetState = () => {
      setState({ inProgress: false, steps: [], completed: false });
    };
  
    const resetIntentModal = async () => {
      if (intentModal.intervalHandler != null) {
        clearAsyncInterval(intentModal.intervalHandler);
      }
      setIntentModal({
        allow: () => { },
        deny: () => { },
        refresh: null,
        intent: null,
        open: false,
        sourcesOpen: true,
        feesBreakupOpen: false,
        intervalHandler: null,
        intentRefreshing: false
      });
    };
  
    const allowIntent = () => {
      console.log("got submit");
      intentModal.allow();
      resetIntentModal();
    };
  
    const rejectIntent = () => {
      console.log("got reject");
      intentModal.deny();
      resetIntentModal();
    };
  
    const handleTransfer = async () => {
      setTransferValue(prevState => ({ ...prevState, loading: true }));
      try {
        console.log({ transferValue: transferValue });
        if (ca) {
          const hash = await ca.transfer()
            .amount(Number(transferValue.amount))
            .chain(Number(transferValue.chain))
            .token(transferValue.token)
            .to(transferValue.to as `0x${string}`)
            .exec();
          console.log({ hash });
          setState(prevState => ({ ...prevState, completed: true }));
        }
      } catch (e: any) {
        resetState();
        console.error("Transfer failed with error", e);
        createErrorToast(e);
      } finally {
        setTransferValue(prevState => ({ ...prevState, loading: false }));
      }
    };
  
    const handleBridge = async () => {
      setBridgeValue(prevState => ({ ...prevState, loading: true }));
      try {
        console.log({ bridgeValue: bridgeValue });
        if (ca) {
          await ca.bridge()
            .amount(bridgeValue.amount)
            .chain(Number(bridgeValue.chain))
            .token(bridgeValue.token)
            .exec();
          setState(prevState => ({ ...prevState, completed: true }));
        }
      } catch (e: any) {
        resetState();
        setMessages(prevState => ({ ...prevState, error: true }));
        createErrorToast(e);
        console.error("Bridge failed with error", e);
      } finally {
        setBridgeValue(prevState => ({ ...prevState, loading: false }));
      }
    };
  
    const handleTransferValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTransferValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };
  
    const handleBridgeValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBridgeValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };
    const handleRefundValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRefundValue(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    };
    const handleTransferChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setTransferValue(prevState => ({ ...prevState, chain: Number(e.target.value) }));
    };
  
    const handleBridgeChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBridgeValue(prevState => ({ ...prevState, chain: Number(e.target.value) }));
    };
  
  
    return (
      <>
        <Toaster toaster={toaster} >
          {(toast) => (
            <Toast.Root className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-500 dark:bg-gray-900">
              <Toast.Description className="basis-5/6 flex items-center">
                <div
                  className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200"
                >
                  <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
                  </svg>
                  <span className="sr-only">Error icon</span>
                </div>
                <div className="ms-3 text-sm font-normal">{toast.description}</div>
              </Toast.Description>
              <Toast.CloseTrigger className="basis-1/6">
                <button type="button"
                  className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                  data-dismiss-target="#toast-danger" aria-label="Close">
                  <span className="sr-only">Close</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                </button>
              </Toast.CloseTrigger>
            </Toast.Root>
          )}
        </Toaster>
  
        {!state.inProgress && (
          <div className="space-x-4">
            {props.currentTab === 'transfer' && (
              <div className="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Transfer</h5>
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
  
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="to">To</label>
                  <input
                    type="text"
                    name="to"
                    value={transferValue.to}
                    onChange={handleTransferValueChange}
                    placeholder="Receiver's address"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="token">Token</label>
                  <input
                    type="text"
                    name="token"
                    value={transferValue.token}
                    onChange={handleTransferValueChange}
                    placeholder="USDT"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
  
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="chain">Chain</label>
                  <select
                    id="chains"
                    name="chain"
                    value={transferValue.chain}
                    onChange={handleTransferChainChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled value={0}>Select chain</option>
                    {CHAINS.map((chain) => (
                      <option key={chain.chainID} value={chain.chainID}>{chain.chainName}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="amount">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={transferValue.amount}
                    onChange={handleTransferValueChange}
                    placeholder="Token amount ex - 1.1"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
  
                <div className="self-end">
                  <button
                    onClick={handleTransfer}
                    disabled={transferValue.loading}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {transferValue.loading && (
                      <svg aria-hidden="true" role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB" />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor" />
                      </svg>
                    )}
                    Transfer
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 14 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
            {props.currentTab === 'bridge' && (
              <div className="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Bridge</h5>
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
  
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="to">To</label>
                  <input
                    type="text"
                    value="SELF"
                    disabled
                    readOnly
                    className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="token">Token</label>
                  <input
                    type="string"
                    placeholder="Token symbol ex - USDT, ETH"
                    name="token"
                    value={bridgeValue.token}
                    onChange={handleBridgeValueChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="amount">Amount</label>
                  <input
                    type="string"
                    placeholder="Token amount ex - 1.1"
                    name="amount"
                    value={bridgeValue.amount}
                    onChange={handleBridgeValueChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="chain">Chain</label>
                  <select
                    id="chains"
                    name="chain"
                    value={bridgeValue.chain}
                    onChange={handleBridgeChainChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option disabled value={0}>Select chain</option>
                    {CHAINS.map((chain) => (
                      <option key={chain.chainID} value={chain.chainID}>{chain.chainName}</option>
                    ))}
                  </select>
                </div>
  
                <button
                  onClick={handleBridge}
                  disabled={bridgeValue.loading}
                  className="text-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {bridgeValue.loading && (
                    <svg aria-hidden="true" role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB" />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor" />
                    </svg>
                  )}
                  Bridge
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </button>
              </div>
            )}
            {props.currentTab === 'refund' && (
              <div className="mx-auto w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Refund</h5>
                <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
  
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="intenthash">Intent Hash</label>
                  <input
                    type="string"
                    placeholder="0x..."
                    name="hash"
                    value={refundValue.hash}
                    onChange={handleRefundValueChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                </div>
  
  
                <button
                  onClick={refundIntent}
                  disabled={refundValue.loading}
                  className="text-right text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  {refundValue.loading && (
                    <svg aria-hidden="true" role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB" />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor" />
                    </svg>
                  )}
                  Refund
                </button>
              </div>
            )}
          </div>
        )}
        {state.inProgress && (
          <div className=" mx-auto">
            <div className="w-full flex space-x-4 mb-6">
              <ul
                className="w-full px-4 bg-white border border-gray-200 rounded-lg shadow sm:px-8 dark:bg-gray-800 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700"
              >
                {state.steps.map((s, index) => (
                  <li key={index} className="flex items-center py-6 px-5 font-medium text-gray-900 dark:text-white">
                    {s.done ? (
                      <svg className="w-5 h-5 me-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                    ) : (
                      <svg aria-hidden="true"
                        className="w-5 h-5 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101"
                        fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor" />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentFill" />
                      </svg>
                    )}
                    {getTextFromStep(s as any)}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={resetState}
              disabled={!state.completed}
              className="text-white text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg className="rotate-180 w-3.5 h-3.5 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
              Go back
            </button>
          </div>
        )}
  
        <Modal isOpen={allowanceModal.open} onModalClose={rejectAllowance} onSubmit={submitAllowance} name="allowance-modal">
          <Modal.Header>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
              Verify allowance
            </h5>
          </Modal.Header>
          <Modal.Children>
            <div className="text-xl font-semibold text-gray-900 dark:text-white">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Token</th>
                    <th className="px-6 py-3">Chain</th>
                    <th className="px-6 py-3">Current Allowance</th>
                    <th className="px-6 py-3">Min Allowance</th>
                    <th className="px-6 py-3">Set Allowance</th>
                  </tr>
                </thead>
                <tbody>
                  {allowanceModal.data.map((elem, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{elem.token.symbol}</td>
                      <td className="px-6 py-4">{`${elem.chainName}(${elem.chainID})`}</td>
                      <td className="px-6 py-4">{elem.currentAllowance.toString().startsWith("11579208923731619542") ? "MAX" :
                        elem.currentAllowance.toString()}</td>
                      <td className="px-6 py-4">
                        {elem.minAllowance.toString()}
                      </td>
                      <td className="px-6 py-4">
                        <input type="string" value="MAX" disabled
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Modal.Children>
        </Modal>
  
        <Modal isDisabled={intentModal.intentRefreshing} isOpen={intentModal.open} onModalClose={rejectIntent}
          onSubmit={allowIntent} name="intent-modal">
          <Modal.Header>
            <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
              Intent details
            </h5>
          </Modal.Header>
          <Modal.Children>
            <div className="p-3">
              <div>
                <div className="flex text-lg text-gray-900 dark:text-white p-2">
                  <div className="basis-1/2 text-sm">Destination Chain</div>
                  <div className="basis-1/2 text-right text-sm">{`${intentModal.intent?.destination.chainName}
                      (${intentModal.intent?.destination.chainID})`}</div>
                </div>
                <div className="flex text-lg text-gray-900 dark:text-white p-2">
                  <div className="basis-1/2 text-sm">Spend</div>
                  <div className="basis-1/2 text-right flex items-end flex-col">
                    <p className="text-sm">{`${intentModal.intent?.sourcesTotal} ${intentModal.intent?.token.symbol}`}</p>
                    <div className="text-right" data-accordion="collapse">
                      <button type="button" className="flex align-right items-center justify-between p-1"
                        onClick={() => setIntentModal(prevState => ({ ...prevState, sourcesOpen: !prevState.sourcesOpen }))}>
                        <span className="text-right text-xs text-gray-400">View sources</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2 text-gray-900 dark:text-white " style={{ display: intentModal.sourcesOpen ? 'block' : 'none' }}>
                  <div className="p-5 bg-gray-200 w-full flex flex-col space-y-6 dark:bg-gray-900 font-xs rounded">
                    {intentModal.intent?.sources.map((source, index) => (
                      <div key={index} className="flex">
                        <div className="basis-1/2 text-xs">
                          {`${intentModal.intent?.token.symbol} (${source.chainName})`}
                        </div>
                        <div className="basis-1/2 text-xs text-right">
                          {`${source.amount} ${intentModal.intent?.token.symbol}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
  
  
  
                <div className="flex text-lg text-gray-900 dark:text-white p-2">
                  <div className="basis-1/2 text-sm">Total Fees</div>
                  <div className="basis-1/2 text-right text-sm flex items-end flex-col">
                    <p>{`${intentModal.intent?.fees.total} ${intentModal.intent?.token.symbol}`}</p>
                    <div className="text-right" data-accordion="collapse">
                      <button type="button" className="flex align-right items-center justify-between p-1"
                        onClick={() => setIntentModal(prevState => ({ ...prevState, feesBreakupOpen: !prevState.feesBreakupOpen }))}>
                        <span className="text-right text-xs text-gray-400">View breakdown</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-2 text-gray-900 dark:text-white " style={{ display: intentModal.feesBreakupOpen ? 'block' : 'none' }}>
                  <div className="p-5 w-full bg-gray-200 flex flex-col space-y-6 dark: bg-gray-900 font-xs rounded">
                    <div className="flex">
                      <div className="basis-1/2 text-xs">
                        CA Gas Fees:
                      </div>
                      <div className="basis-1/2 text-xs text-right">
                        {`${intentModal.intent?.fees.caGas} ${intentModal.intent?.token.symbol}`}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="basis-1/2 text-xs">
                        Solver Fees:
                      </div>
                      <div className="basis-1/2 text-xs text-right">
                        {`${intentModal.intent?.fees.solver} ${intentModal.intent?.token.symbol}`}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="basis-1/2 text-xs">
                        Protocol Fees:
                      </div>
                      <div className="basis-1/2 text-xs text-right">
                        {`${intentModal.intent?.fees.protocol} ${intentModal.intent?.token.symbol}`}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="basis-1/2 text-xs">
                        Gas supplied:
                      </div>
                      <div className="basis-1/2 text-xs text-right">
                        0 {`${intentModal.intent?.token.symbol}`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Children>
        </Modal>
      </>
    );
  };

export {Transfer};