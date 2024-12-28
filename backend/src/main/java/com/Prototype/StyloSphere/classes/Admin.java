package com.Prototype.StyloSphere.classes;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;

import java.util.List;

@Entity
@DiscriminatorValue("Admin")
public class Admin extends User {
    private String adminLevel;
    public Admin() {
    }

    public Admin(String name, String email, String password, String adminLevel) {
        super(name, email, password);
        this.adminLevel = adminLevel;
    }

    public String getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }
}
