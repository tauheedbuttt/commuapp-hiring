<?php declare(strict_types=1);

namespace App\Services\Commu\Generated\Operations\Notice;

class NoticeResult extends \Spawnia\Sailor\Result
{
    public ?Notice $data = null;

    protected function setData(\stdClass $data): void
    {
        $this->data = Notice::fromStdClass($data);
    }

    /**
     * Useful for instantiation of successful mocked results.
     *
     * @return static
     */
    public static function fromData(Notice $data): self
    {
        $instance = new static;
        $instance->data = $data;

        return $instance;
    }

    public function errorFree(): NoticeErrorFreeResult
    {
        return NoticeErrorFreeResult::fromResult($this);
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
