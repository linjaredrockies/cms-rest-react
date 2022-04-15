package com.ctrockies.cms;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Component;

import com.ctrockies.cms.data.Teacher;
import com.ctrockies.cms.repository.TeacherRepository;

@Component
@EnableJpaRepositories("com.ctrockies.cms.repository") 
public class DatabaseLoader implements CommandLineRunner {
	private final TeacherRepository repository;

	@Autowired
	public DatabaseLoader(TeacherRepository repository) {
		this.repository = repository;
	}

	public void run(String... strings) throws Exception {
		this.repository.save(new Teacher("jsmith@tbschool.org", "Frodo", "Baggins", "876123459"));
	}
}
