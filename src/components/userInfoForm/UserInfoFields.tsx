'use client';
import React, { ChangeEvent } from 'react';
import { IInterestTypes, IUserRebateInfoProps } from '../../utils/userRebateInfoTypes';
import styles from './UserInfoForm.module.scss';

interface UserInfoFieldsProps {
  formData: Partial<IUserRebateInfoProps>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleInterestChange: (interest: IInterestTypes) => void;
}

const UserInfoFields: React.FC<UserInfoFieldsProps> = ({ formData, handleInputChange, handleInterestChange }) => {
  return (
    <>
      <div className={styles.formGroup}>
        <label htmlFor='first_name'>First Name:</label>
        <input type='text' id='first_name' name='first_name' value={formData.first_name || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='last_name'>Last Name:</label>
        <input type='text' id='last_name' name='last_name' value={formData.last_name || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='email'>Email:</label>
        <input type='email' id='email' name='email' value={formData.email || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='phone'>Phone:</label>
        <input type='tel' id='phone' name='phone' value={formData.phone || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='address'>Street Address:</label>
        <input type='text' id='address' name='address' value={formData.address || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='address2'>Street Address 2:</label>
        <input type='text' id='address2' name='address2' value={formData.address2 || ''} onChange={handleInputChange} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='city'>City:</label>
        <input type='text' id='city' name='city' value={formData.city || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='state'>State:</label>
        <input type='text' id='state' name='state' value={formData.state || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='zip'>ZIP:</label>
        <input type='text' id='zip' name='zip' value={formData.zip || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='country'>Country:</label>
        <input type='text' id='country' name='country' value={formData.country || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='store_name'>Store Name:</label>
        <input type='text' id='store_name' name='store_name' value={formData.store_name || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='store_city'>Store City:</label>
        <input type='text' id='store_city' name='store_city' value={formData.store_city || ''} onChange={handleInputChange} required />
      </div>
      <div className={`${styles.formGroup} ${styles.interests}`}>
        <p>Interests:</p>
        <div className={styles.checkboxContainer}>
          {Object.values(IInterestTypes).map(interest => (
            <label key={interest}>
              <input type='checkbox' checked={formData.interests?.includes(interest)} onChange={() => handleInterestChange(interest)} />
              {interest}
            </label>
          ))}
        </div>
      </div>
      <div className={`${styles.formGroup} ${styles.subscription}`}>
        <label>
          <input type='checkbox' name='subscription' checked={formData.subscription || false} onChange={handleInputChange} />
          Subscribe to newsletter
        </label>
      </div>
      <div className={`${styles.formGroup} ${styles.comments}`}>
        <label htmlFor='comments1'>Comments:</label>
        <textarea id='comments1' name='comments1' value={formData.comments1 || ''} onChange={handleInputChange}></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='product_code'>Product Code:</label>
        <input type='text' id='product_code' name='product_code' value={formData.product_code || ''} onChange={handleInputChange} required />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor='redeem_code'>Redeem Code:</label>
        <input type='text' id='redeem_code' name='redeem_code' value={formData.redeem_code || ''} onChange={handleInputChange} required />
      </div>
    </>
  );
};

export default UserInfoFields;
