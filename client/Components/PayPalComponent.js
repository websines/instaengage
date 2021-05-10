import {useRef, useEffect} from 'react'


export default function PayPalComponent({plan}) {

    const paypal = useRef()
    console.log(plan)

    useEffect(() => {
        window.paypal.Buttons({
            createSubscription: function(data, actions) {
              return actions.subscription.create({
                'plan_id': plan // Creates the subscription
              });
            },
            onApprove: function(data, actions) {
              alert('You have successfully created subscription ' + data.subscriptionID); // Optional message given to subscriber
            }
          }).render(paypal.current);
    }, [])

    return (
        <div>
            <div ref={paypal}>
            </div>
        </div>
    )
}
