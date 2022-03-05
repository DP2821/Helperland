using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Helperland.Models
{
    public class MailRequest
    {
        public void SendEmail(String receiverEmail, String nameOfUser, String subject, String body)
        {

            MailMessage mailMessage = new MailMessage("nirmalbadodariya@gmail.com", receiverEmail);
            mailMessage.Subject = subject;
            // mailMessage.Body = body + "\n\n" + "Your Faithful\n" + nameOfUser;
            mailMessage.Body = body;

            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.Credentials = new System.Net.NetworkCredential()
            {
                UserName = "nirmalbadodariya@gmail.com",
                Password = "n$1i$2r$3"
            };

            client.EnableSsl = true;
            client.Send(mailMessage);
        }
    }
    }
