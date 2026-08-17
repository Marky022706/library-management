<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../../middleware/auth.php';

class AuthInputParsingTest extends TestCase
{
    public function testJsonRequestBodyIsParsed(): void
    {
        $input = parseRequestInputFromString('{"email":"superadmin@balingasag.gov.ph","password":"superadmin123"}');

        $this->assertSame('superadmin@balingasag.gov.ph', $input['email']);
        $this->assertSame('superadmin123', $input['password']);
    }

    public function testFormRequestBodyIsParsed(): void
    {
        $input = parseRequestInputFromString('email=superadmin@balingasag.gov.ph&password=superadmin123');

        $this->assertSame('superadmin@balingasag.gov.ph', $input['email']);
        $this->assertSame('superadmin123', $input['password']);
    }
}
