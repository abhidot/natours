import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51J0gPFSFbq2eWSrc1tkdHHMLgXj8Idd6aZJr5jJ9K44LeTeDX2kPsO1PYJwwdbPu8jEsCifv0AjVCEzvmeRX9TwH0071wrXeTu'
);

export const bookTour = async (tourId) => {
  try {
    // Get Checkout session from API
    const session = await axios({
      url: `http://localhost:5000/api/v1/bookings/checkout-session/${tourId}`,
      method: 'GET',
    });

    //Create session + charge credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
