import { TestBed } from '@angular/core/testing';
import { CusEncryptionService } from './cus-encryption.service';

describe('CusEncryptionService', () => {
  let service: CusEncryptionService; // <--- Esta declaración es la que te falta o está mal ubicada

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CusEncryptionService],
    });
    service = TestBed.inject(CusEncryptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('generateCus', () => {
    beforeEach(() => {
      // Instalamos el reloj para controlar Date.now()
      jasmine.clock().install();
    });

    afterEach(() => {
      // Es vital desinstalarlo para no afectar otros tests
      jasmine.clock().uninstall();
    });

    it('should return a string that starts with the base and a timestamp', () => {
      const base = 'BASE123';
      const result = service.generateCus(base);
      expect(result.startsWith(`${base}-`)).toBeTrue();

      const timestampPart = result.split('-')[1];
      expect(Number(timestampPart)).not.toBeNaN();
    });

    it('should generate different values for subsequent calls', () => {
      const base = 'BASE123';

      // Fijamos una fecha base
      const baseDate = new Date('2025-01-01T10:00:00');
      jasmine.clock().mockDate(baseDate);

      const first = service.generateCus(base);

      // Adelantamos el tiempo artificialmente 1 milisegundo
      jasmine.clock().tick(1);

      const second = service.generateCus(base);

      // Ahora sí serán diferentes garantizado
      expect(first).not.toBe(second);
      expect(first).toContain('1735725600000');
      expect(second).toContain('1735725600001');
    });
  });

  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt correctly', () => {
      const original = 'MySecret123';
      const encrypted = service.encrypt(original);
      const decrypted = service.decrypt(encrypted);

      expect(encrypted).not.toBe(original);
      expect(decrypted).toBe(original);
    });

    it('should return empty string when decrypting invalid string', () => {
      const decrypted = service.decrypt('invalid-string');
      expect(decrypted).toBe('');
    });
  });
});
