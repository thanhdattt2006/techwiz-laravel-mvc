<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Traits\ApiResponse;
use PHPUnit\Framework\TestCase;

class ApiResponseTraitTest extends TestCase
{
    private object $classUsingTrait;

    protected function setUp(): void
    {
        parent::setUp();

        $this->classUsingTrait = new class {
            use ApiResponse;

            public function testSuccess($data = null, string $message = '', int $statusCode = 200)
            {
                return $this->successResponse($data, $message, $statusCode);
            }

            public function testError(string $message = '', int $statusCode = 400, $errors = null)
            {
                return $this->errorResponse($message, $statusCode, $errors);
            }
        };
    }

    public function test_success_response_structure(): void
    {
        $response = $this->classUsingTrait->testSuccess(['id' => 1, 'name' => 'MarketLink'], 'Success', 200);

        $this->assertEquals(200, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);

        $this->assertTrue($content['success']);
        $this->assertEquals('Success', $content['message']);
        $this->assertEquals(['id' => 1, 'name' => 'MarketLink'], $content['data']);
        $this->assertNull($content['errors']);
    }

    public function test_error_response_structure(): void
    {
        $response = $this->classUsingTrait->testError('Invalid data', 422, ['field' => ['Field is required']]);

        $this->assertEquals(422, $response->getStatusCode());
        $content = json_decode($response->getContent(), true);

        $this->assertFalse($content['success']);
        $this->assertEquals('Invalid data', $content['message']);
        $this->assertNull($content['data']);
        $this->assertEquals(['field' => ['Field is required']], $content['errors']);
    }
}
