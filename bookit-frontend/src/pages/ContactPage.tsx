const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        Have a question or need help with a booking? We're here for you!
      </p>
      <ul className="space-y-2 text-lg">
        <li>
          <strong className="w-20 inline-block">Email:</strong>{' '}
          <a
            href="mailto:support@bookit.com"
            className="text-blue-600 hover:underline"
          >
            support@bookit.com
          </a>
        </li>
        <li>
          <strong className="w-20 inline-block">Phone:</strong> +1 (234)
          567-890
        </li>
        <li>
          <strong className="w-20 inline-block">Address:</strong> 123 Travel
          Lane, Wanderlust City, World
        </li>
      </ul>
    </div>
  );
};

export default ContactPage;