package com.fpt.Graduation_Project_SEP490_NongSan.service.imp;

import com.fpt.Graduation_Project_SEP490_NongSan.modal.OrderItem;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Orders;
import com.fpt.Graduation_Project_SEP490_NongSan.modal.Product;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.OrderItemRepository;
import com.fpt.Graduation_Project_SEP490_NongSan.repository.OrdersRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public void sendVerificationOtpEmail(String email, String otp) throws MessagingException {

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Verify OTP";
        String text = "Your verification code is " + otp + ". Please verify your OTP.";

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(text);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        }

        catch (MailException e) {
            throw new MailSendException(e.getMessage());
        }
    }

    public void sendDetailsOrderEmail(String email, Orders order) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        String subject = "Đặt hàng thành công - Mã đơn hàng: " + order.getId();
        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<div style='font-family: Arial, sans-serif; color: #333;'>");
        emailContent.append("<h2 style='color: #4CAF50;'>Cảm ơn bạn đã đặt hàng!</h2>");
        emailContent.append("<p><strong>Mã đơn hàng:</strong> ").append(order.getId()).append("</p>");
        emailContent.append("<p><strong>Ghi chú đơn hàng:</strong> ").append(order.getTransferContent()).append("</p>");

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM yyyy HH:mm:ss", new Locale("vi", "VN"));
        String formattedDate = sdf.format(order.getCreateDate());

        emailContent.append("<p><strong>Ngày đặt hàng:</strong> ").append(formattedDate).append("</p>");

        emailContent.append("<p><strong>Trạng thái:</strong> ").append(order.getStatus()).append("</p>");
        emailContent.append("<p><strong>Tổng số tiền thanh toán:</strong> ").append(order.getAmount_paid()).append(" VND</p>");

        emailContent.append("<p><strong>Tiền quản lý hệ thống:</strong> ").append(order.getAdmin_commission()).append(" VND</p>");

        emailContent.append("<h3 style='color: #4CAF50;'>Chi tiết sản phẩm:</h3>");
        emailContent.append("<table style='width: 100%; border-collapse: collapse;'>");
        emailContent.append("<thead><tr style='background-color: #f2f2f2;'>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Sản phẩm</th>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Số lượng</th>")
                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Đơn giá (VND)</th>")
                .append("</tr></thead>");
        emailContent.append("<tbody>");

        List<OrderItem> orderItems = orderItemRepository.findByOrders(order);
        for (OrderItem item : orderItems) {
            emailContent.append("<tr>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>").append(item.getProduct().getName()).append("</td>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: center;'>").append(item.getQuantity()).append("</td>")
                    .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>").append(item.getPrice()).append("</td>")
                    .append("</tr>");
        }

        emailContent.append("</tbody></table>");
        emailContent.append("<p style='margin-top: 20px;'>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline: 0987654321. Chúng tôi rất hân hạnh được phục vụ bạn!</p>");
        emailContent.append("<p style='color: #777;'>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>");
        emailContent.append("</div>");

        mimeMessageHelper.setSubject(subject);
        mimeMessageHelper.setText(emailContent.toString(), true);
        mimeMessageHelper.setTo(email);

        try {
            javaMailSender.send(mimeMessage);
        } catch (MailException e) {
            throw new MailSendException("Không thể gửi email chi tiết đơn hàng: " + e.getMessage());
        }
    }

//    public void sendDetailsOrderWithdrawalRequest(String email, Orders order) throws MessagingException {
//        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//        MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, "utf-8");
//
//        String subject = "Yêu cầu rút tiền - Mã đơn hàng: " + order.getId(); // Subject updated for admin to seller
//        StringBuilder emailContent = new StringBuilder();
//        emailContent.append("<div style='font-family: Arial, sans-serif; color: #333;'>");
//        emailContent.append("<h2 style='color: #4CAF50;'>Thông báo về yêu cầu rút tiền của đơn hàng!</h2>");
//        emailContent.append("<p><strong>Mã đơn hàng:</strong> ").append(order.getId()).append("</p>");
//        emailContent.append("<p><strong>Ghi chú đơn hàng:</strong> ").append(order.getTransferContent()).append("</p>");
//
//        SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM yyyy HH:mm:ss", new Locale("vi", "VN"));
//        String formattedDate = sdf.format(order.getCreateDate());
//
//        emailContent.append("<p><strong>Ngày đặt hàng:</strong> ").append(formattedDate).append("</p>");
//        emailContent.append("<p><strong>Trạng thái đơn hàng:</strong> ").append(order.getStatus()).append("</p>");
//        emailContent.append("<p><strong>Tổng số tiền thanh toán:</strong> ").append(order.getAmount_paid()).append(" VND</p>");
//        emailContent.append("<p><strong>Trạng thái rút tiền yêu cầu:</strong> ").append(order.getWithdrawalRequest()).append("</p>");
//        emailContent.append("<p><strong>Tiền quản lý hệ thống:</strong> ").append(order.getAdmin_commission()).append(" VND</p>");
//
//        emailContent.append("<h3 style='color: #4CAF50;'>Chi tiết sản phẩm:</h3>");
//        emailContent.append("<table style='width: 100%; border-collapse: collapse;'>");
//        emailContent.append("<thead><tr style='background-color: #f2f2f2;'>")
//                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Sản phẩm</th>")
//                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Số lượng</th>")
//                .append("<th style='padding: 8px; border: 1px solid #ddd;'>Đơn giá (VND)</th>")
//                .append("</tr></thead>");
//        emailContent.append("<tbody>");
//
//        List<OrderItem> orderItems = orderItemRepository.findByOrders(order);
//        for (OrderItem item : orderItems) {
//            emailContent.append("<tr>")
//                    .append("<td style='padding: 8px; border: 1px solid #ddd;'>").append(item.getProduct().getName()).append("</td>")
//                    .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: center;'>").append(item.getQuantity()).append("</td>")
//                    .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>").append(item.getPrice()).append("</td>")
//                    .append("</tr>");
//        }
//
//        emailContent.append("</tbody></table>");
//        emailContent.append("<p style='margin-top: 20px;'>Chúng tôi đã gởi tiền theo yêu cầu rút tiền từ bạn. Sau khi xác nhận, tiền đã được chuyển vào tài khoản của bạn theo đơn hàng này.</p>");
//        emailContent.append("<p style='color: #777;'>Trân trọng,<br>Đội ngũ quản lý hệ thống</p>");
//        emailContent.append("</div>");
//
//        mimeMessageHelper.setSubject(subject);
//        mimeMessageHelper.setText(emailContent.toString(), true);
//        mimeMessageHelper.setTo(email);
//
//        try {
//            javaMailSender.send(mimeMessage);
//        } catch (MailException e) {
//            throw new MailSendException("Không thể gửi email yêu cầu rút tiền: " + e.getMessage());
//        }
//    }
}
