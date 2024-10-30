import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function verifySubscription(subscriptionData: any) {
  try {
    // Verify payment and subscription details with Stripe
    const subscription = await stripe.subscriptions.retrieve(
      subscriptionData.stripeSubscriptionId
    );

    return subscription.status === "active";
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return false;
  }
}
