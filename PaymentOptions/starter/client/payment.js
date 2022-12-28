document.addEventListener('DOMContentLoaded', async ()=> {
    //Fetch puclishable key and inin stipe
    const {publishableKey} = await fetch("/config").then(r => r.json())
    const stripe = Stripe(publishableKey)

    //Fetch the client secret and initialize elements
    const {clientSecret} = await fetch("/create-payment-intent", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(r => r.json())

    const elements = stripe.elements({clientSecret})
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')

    const form = document.getElementById('payment-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const {error} = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href.split("?")[0] + "complete.html"
            }
        })
        if(error) {
          const messages = document.getElementById('error-messages')
          messages.innerText - error.message;
        }
    })
})