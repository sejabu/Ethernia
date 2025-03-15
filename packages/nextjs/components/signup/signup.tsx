
import { PiNumberCircleOne } from "react-icons/pi";

export default function SignUp() {

    return (
        <div className='flex flex-col justify-center space-x-4 mt-24 w-1/2 mx-auto'>
                <div className='bg-base-300 mb-6'>
                    <div className='flex flex-col bg-base-100 m-12 p-6 justify-center w-auto lg:w-96 shadow-sm '>
                        <img src="/ethernia-logo-94x94.png" alt="Ethernia Logo" className="" />
                        <h3 className="card-title">Welcome to Ethernia</h3>
                        <p className="card-body">This is the first step to Secure Your Crypto Legacy </p>
                        <p className="card-body">We will be guiding you to easily register and set up your digital inheritance plan.</p>
                    </div>    
                </div>    

                <div className='card card-bordered bg-base-300 mb-6'>
                    <div className='card-body'>
                        <h3 className='card-title'><PiNumberCircleOne />&nbsp;User Type</h3>
                        <div className='flex flex-col space-x-0 space-y-4 justify-center lg:flex-row lg:space-x-4 lg:space-y-0 lg:align-items: stretch'>
                        <div className="card bg-base-100 w-auto lg:w-96 shadow-sm flex: 1">
                            <figure className="px-10 pt-10">
                               <img
                               src="/imtestator94x94.png"
                               alt="I'm Testator"
                               className="rounded-xl" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">I'm a Testator</h2>
                                <p>And I want to set up my inheritance plan.</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary" onClick={()=>(document.getElementById('my_modal_5') as HTMLDialogElement).showModal()}>Register</button>
                                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                                        <div className="modal-box">
                                            <h3 className="font-bold text-lg">Login with your wallet.</h3>
                                            <p className="py-4 jus">If you want to create a new wallet for the will purpose (not necessary!), instead, log in with your email and a new one will be created. Then, you will have to transfer the funds that you want to be available to your beneficiaries to this new wallet.</p>
                                            <div className="modal-action justify-center">
                                                <form method="dialog">
                                                {/* if there is a button in form, it will close the modal */}
                                                <button className="btn">Login</button>
                                                </form>
                                            </div>
                                        </div>
                                    </dialog>
                                </div>
                            </div>
                        </div>
                        <div className="card bg-base-100 w-auto lg:w-96 shadow-sm flex: 1">
                            <figure className="px-10 pt-10">
                               <img
                               src="/imbeneficiary94x94.png"
                               alt="I'm Beneficiary"
                               className="rounded-xl" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">I'm a Beneficiary</h2>
                                <p>And I want to accept be include in an inheritance plan.</p>
                                <div className="card-actions">
                                    <button className="btn btn-primary">Register</button>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}