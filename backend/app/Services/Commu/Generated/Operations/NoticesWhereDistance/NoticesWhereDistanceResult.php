<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\NoticesWhereDistance;

class NoticesWhereDistanceResult extends \Spawnia\Sailor\Result
{
    public ?NoticesWhereDistance $data = null;

    protected function setData(\stdClass $data): void
    {
        $this->data = NoticesWhereDistance::fromStdClass($data);
    }

    /**
     * Useful for instantiation of successful mocked results.
     *
     * @return static
     */
    public static function fromData(NoticesWhereDistance $data): self
    {
        $instance = new static;
        $instance->data = $data;

        return $instance;
    }

    public function errorFree(): NoticesWhereDistanceErrorFreeResult
    {
        return NoticesWhereDistanceErrorFreeResult::fromResult($this);
    }

    public static function endpoint(): string
    {
        return 'commu';
    }

    public static function config(): string
    {
        return \Safe\realpath(__DIR__ . '/../../../../../../sailor.php');
    }
}
