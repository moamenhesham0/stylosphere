package com.Prototype.StyloSphere.classes;

import java.util.Arrays;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "images")
public class Image {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private byte[] image;
    private String attType;
    private String attName;
    private float attSize;
    public String getAttName() {
        return attName;
    }

    public void setAttName(String attName) {
        this.attName = attName;
    }


    public byte[] getimage() {
        return image;
    }

    public void setimage(byte[] image) {
        this.image = image;
    }

    public String getAttType() {
        return attType;
    }

    public void setAttType(String attType) {
        this.attType = attType;
    }

    public float getAttSize() {
        return attSize;
    }

    public void setAttSize(float attSize) {
        this.attSize = attSize;
    }

    @Override
    public String toString() {
        return "image [image=" + Arrays.toString(image) + ", attType=" + attType + ", attName=" + attName
                + ", attSize=" + attSize + "]";
    }




}
