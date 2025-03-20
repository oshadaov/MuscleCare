import ContactForm from "../../components/contactComponents/ContactForm"
import ContactInfo from "../../components/contactComponents/ContactInfo"
import './Contact.css'
const Contact = () => {
  return (
  
    <div className="container">
    
        

      <div className="contactsection">

          <div className="max-">
            <h1 className="tex">Contact Us</h1>
            <p className="ppp">Have questions or need assistance? We're here to help you.</p>
          </div>
      

      {/* Contact Section */}
      
        <div className="contact-Section">
        <div className="grid">
        <ContactInfo />
          </div> 
          <div className="grid">
            <ContactForm />
          </div>
          

        </div>
      

      

      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="lastCenter">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="bg-">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What are your operating hours?</h3>
              <p className="text-gray-600">
                Our clinic is open Monday through Friday from 8:00 AM to 6:00 PM, Saturday from 9:00 AM to 2:00 PM, and
                closed on Sundays.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you accept insurance?</h3>
              <p className="text-gray-600">
                Yes, we accept most major insurance plans. Please contact our office to verify if we accept your
                specific insurance provider.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I schedule an appointment?</h3>
              <p className="text-gray-600">
                You can schedule an appointment through our online booking system, by calling our office, or by sending
                us a message through this contact form.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What should I bring to my first appointment?</h3>
              <p className="text-gray-600">
                Please bring your ID, insurance card, a list of current medications, and any relevant medical records or
                test results.
              </p>
            </div>
          </div>
        </div>
        </div>
        </div>
        </div>
       )
}

export default Contact

