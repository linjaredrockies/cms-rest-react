package com.ctrockies.cms.repository;
import com.ctrockies.cms.data.Student;
import com.ctrockies.cms.data.Teacher;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

public interface TeacherRepository extends PagingAndSortingRepository<Teacher, Long> {
	List<Teacher> findByFirstName(String firstName);
	List<Student> findByLastName(String lastName);
	List<Student> findByEmail(String email);
	List<Student> findByPhoneNumber(String phoneNumber);
	

}
