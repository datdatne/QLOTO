package com.otostore.oto_shop.Service;

import com.otostore.oto_shop.Entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    // Đăng ký user mới
    User registerUser(User user);

    // Đăng nhập (sẽ làm đơn giản, không dùng JWT)
    Optional<User> login(String username, String password);

    // Lấy tất cả user
    List<User> getAllUsers();

    // Lấy user theo ID
    Optional<User> getUserById(Integer id);

    // Lấy user theo username
    Optional<User> getUserByUsername(String username);

    // Cập nhật thông tin user
    User updateUser(Integer id, User user);

    // Xóa user
    void deleteUser(Integer id);

    // Kiểm tra username đã tồn tại
    boolean existsByUsername(String username);

    // Kiểm tra email đã tồn tại
    boolean existsByEmail(String email);
}