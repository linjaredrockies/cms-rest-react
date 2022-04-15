package com.ctrockies.cms.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.ctrockies.cms.data.Student;

public interface StudentRepository extends CrudRepository <Student, Long>{
	List<Student> findByFirstName(String firstName);
	List<Student> findByLastName(String lastName);
	List<Student> findByStudentNumber(Integer studentNumber);

}
